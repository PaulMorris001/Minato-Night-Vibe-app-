import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * Backfill the new `country` dimension on pre-existing (US-only) data so the
 * international rollout doesn't strand any current records.
 *   - guides: set country = "United States" where missing
 *   - cities: set country = "United States" where missing
 *   - users:  set location.country = "United States" where a location exists
 */
async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const Guide = mongoose.model('guide', new mongoose.Schema({}, { strict: false }));
    const City = mongoose.model('city', new mongoose.Schema({}, { strict: false }));
    const User = mongoose.model('user', new mongoose.Schema({}, { strict: false }));

    const missing = { $in: [null, undefined, ''] };

    // Repair guides whose `city` was turned into an ObjectId string by the old
    // migrate-guide-cities.js. The model intends `city` to be the city NAME, so
    // resolve the id back to the name/state/country via the city collection.
    const objectIdLike = /^[0-9a-fA-F]{24}$/;
    const allGuides = await Guide.find({});
    let repaired = 0;
    for (const guide of allGuides) {
      // city may be stored as a real ObjectId or as its hex string
      const cityIsObjectId =
        guide.city instanceof mongoose.Types.ObjectId ||
        (guide.city != null && objectIdLike.test(String(guide.city)));
      if (cityIsObjectId) {
        const city = await City.findById(String(guide.city)).catch(() => null);
        if (city) {
          const stateIsObjectId =
            guide.cityState != null && objectIdLike.test(String(guide.cityState));
          await Guide.updateOne(
            { _id: guide._id },
            {
              $set: {
                city: city.name,
                cityState: guide.cityState && !stateIsObjectId ? guide.cityState : (city.state || ''),
                country: city.country || 'United States',
              },
            }
          );
          repaired++;
        }
      }
    }
    console.log(`Guides repaired (ObjectId city -> name): ${repaired}`);

    const guideRes = await Guide.updateMany(
      { country: missing },
      { $set: { country: 'United States' } }
    );
    console.log(`Guides country backfilled: ${guideRes.modifiedCount}`);

    const cityRes = await City.updateMany(
      { country: missing },
      { $set: { country: 'United States' } }
    );
    console.log(`Cities updated: ${cityRes.modifiedCount}`);

    const userRes = await User.updateMany(
      { 'location.city': { $nin: [null, undefined, ''] }, 'location.country': missing },
      { $set: { 'location.country': 'United States' } }
    );
    console.log(`Users updated: ${userRes.modifiedCount}`);

    await mongoose.disconnect();
    console.log('\nDone. Disconnected from MongoDB');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrate();
