/**
 * Profile information parser
 */

import { getBySuffix, parseJsonSafe } from '../utils/index.js';
import { FILE_PATHS } from '../constants/resultTemplate.js';

/**
 * Parse profile information
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseProfile(vfs, result) {
  const profileText = getBySuffix(vfs, FILE_PATHS.PROFILE);
  
  if (!profileText) return;
  
  const profileObj = parseJsonSafe(profileText, {});
  const pu = profileObj?.profile_user?.[0];
  
  if (pu?.string_map_data) {
    result.profile = {
      username: pu.string_map_data?.Username?.value || '',
      name: pu.string_map_data?.Name?.value || '',
      email: pu.string_map_data?.Email?.value || '',
      phone: pu.string_map_data?.['Phone Number']?.value || '',
      website: pu.string_map_data?.Website?.value || '',
      private: pu.string_map_data?.['Private Account']?.value === 'True',
    };
  }
}

/**
 * Parse personal information details
 * @param {Map} vfs - Virtual file system  
 * @param {Object} result - Result object to populate
 */
export function parsePersonalInfoDetails(vfs, result) {
  // Friend map
  const friendMapText = getBySuffix(vfs, 'personal_information/personal_information/instagram_friend_map.json');
  if (friendMapText) {
    const arr = parseJsonSafe(friendMapText, []);
    result.personalInfoDetails.friendMap = Array.isArray(arr) ? arr.length : 0;
  }

  // Note interactions
  const noteInteractionsText = getBySuffix(vfs, 'personal_information/personal_information/note_interactions.json');
  if (noteInteractionsText) {
    const arr = parseJsonSafe(noteInteractionsText, []);
    result.personalInfoDetails.noteInteractions = Array.isArray(arr) ? arr.length : 0;
  }

  // Professional information
  const professionalInfoText = getBySuffix(vfs, 'personal_information/personal_information/professional_information.json');
  if (professionalInfoText) {
    const obj = parseJsonSafe(professionalInfoText, {});
    result.personalInfoDetails.professional = obj || {};
  }

  // Profile changes
  const profileChangesText = getBySuffix(vfs, 'personal_information/personal_information/profile_changes.json');
  if (profileChangesText) {
    const arr = parseJsonSafe(profileChangesText, []);
    result.personalInfoDetails.profileChanges = Array.isArray(arr) ? arr.length : 0;
  }

  // Profile information
  const profileInfoText = getBySuffix(vfs, 'personal_information/personal_information/instagram_profile_information.json');
  if (profileInfoText) {
    const obj = parseJsonSafe(profileInfoText, {});
    result.personalInfoDetails.profile = obj || {};
  }
}

/**
 * Parse info about you section
 * @param {Map} vfs - Virtual file system
 * @param {Object} result - Result object to populate
 */
export function parseInfoAboutYou(vfs, result) {
  // Locations of interest
  const locationsInterestText = getBySuffix(vfs, 'personal_information/information_about_you/locations_of_interest.json');
  if (locationsInterestText) {
    const arr = parseJsonSafe(locationsInterestText, []);
    result.infoAboutYou.locationsOfInterest = Array.isArray(arr) ? arr.length : 0;
  }

  // Possible phone numbers
  const possiblePhonesText = getBySuffix(vfs, 'personal_information/information_about_you/possible_phone_numbers.json');
  if (possiblePhonesText) {
    const arr = parseJsonSafe(possiblePhonesText, []);
    result.infoAboutYou.possiblePhoneNumbers = Array.isArray(arr) ? arr.length : 0;
  }

  // Profile based in
  const profileBasedInText = getBySuffix(vfs, 'personal_information/information_about_you/profile_based_in.json');
  if (profileBasedInText) {
    const obj = parseJsonSafe(profileBasedInText, {});
    result.infoAboutYou.profileBasedIn = obj?.string_map_data?.['Profile based in']?.value || obj?.title || '';
  }
}
