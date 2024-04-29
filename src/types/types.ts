export interface Yeti {
    id: number;
    name: string;
    height: number;
    weight: number;
    location: string;
    photo_url: string;
    gender: string;
  }
  
  export interface Review {
    text: string;
    rating: number;
  }
  
  export interface YetinderProps {
    averageRating: number;
  }