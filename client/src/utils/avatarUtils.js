import {
  Person,
  PersonOutline,
  Face,
  AccountCircle,
  SupervisedUserCircle,
  EmojiEmotions,
  SentimentSatisfied,
  TagFaces,
  Mood,
  InsertEmoticon,
  SentimentVerySatisfied,
  Psychology,
} from '@mui/icons-material';

export const AVATAR_MAP = {
  'person': { icon: Person, color: '#1976d2' },
  'person-outline': { icon: PersonOutline, color: '#2196f3' },
  'face': { icon: Face, color: '#03a9f4' },
  'account-circle': { icon: AccountCircle, color: '#00bcd4' },
  'supervised': { icon: SupervisedUserCircle, color: '#009688' },
  'emoji-emotions': { icon: EmojiEmotions, color: '#4caf50' },
  'sentiment-satisfied': { icon: SentimentSatisfied, color: '#8bc34a' },
  'tag-faces': { icon: TagFaces, color: '#cddc39' },
  'mood': { icon: Mood, color: '#ffeb3b' },
  'insert-emoticon': { icon: InsertEmoticon, color: '#ffc107' },
  'sentiment-very-satisfied': { icon: SentimentVerySatisfied, color: '#ff9800' },
  'psychology': { icon: Psychology, color: '#ff5722' },
};

export const getAvatarConfig = (avatarId) => {
  return AVATAR_MAP[avatarId] || AVATAR_MAP['person'];
};
