export type TabType = 'home' | 'services' | 'activity' | 'account';
export type AppMode = 'vago' | 'courier';

export interface SuggestionItem {
  id: string;
  title: string;
  badge?: string;
  iconName: string;
  iconType: 'ionicons' | 'material-community' | 'font-awesome5';
  action: () => void;
}
