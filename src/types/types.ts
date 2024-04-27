export interface Review {
    text: string;
    rating: number;
}

export interface Yeti {
    id: number;
    name: string;
    height: number;
    weight: number;
    address: string; 
    photo: string;
    rating: Review;
    reviews: Review[];
}

