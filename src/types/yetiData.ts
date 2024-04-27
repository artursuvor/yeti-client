import { Review, Yeti } from './types';

class YetiClass implements Yeti {
  id: number;
  name: string;
  height: number;
  weight: number;
  address: string;
  photo: string;
  rating: Review;
  reviews: Review[];

  constructor(
    id: number,
    name: string,
    height: number,
    weight: number,
    address: string,
    photo: string,
    rating: Review,
    reviews: Review[]
  ) {
    this.id = id;
    this.name = name;
    this.height = height;
    this.weight = weight;
    this.address = address;
    this.photo = photo;
    this.rating = rating;
    this.reviews = reviews;
  }
}

const review1: Review = { text: "Great Yeti!", rating: 5 };
const review2: Review = { text: "Could be better", rating: 3 };
const review3: Review = { text: "Not what I expected", rating: 2 };

const yeti1: Yeti = new YetiClass(1, "Bigfoot", 300, 500, "Himalayas", "/img/yeti1.png", review1, [review2, review3]);
const yeti2: Yeti = new YetiClass(2, "Sasquatch", 280, 450, "Pacific Northwest", "/img/yeti2.png", review2, [review1]);
const yeti3: Yeti = new YetiClass(3, "Abominable Snowman", 320, 600, "Tibet", "/img/yeti3.png", review3, [review1, review2]);
const yeti4: Yeti = new YetiClass(4, "Yowie", 270, 400, "Australia", "/img/yeti4.png", review1, [review3]);
const yeti5: Yeti = new YetiClass(5, "Almas", 250, 350, "Central Asia", "/img/yeti5.png", review2, [review1]);
const yeti6: Yeti = new YetiClass(6, "Skunk Ape", 290, 480, "Florida", "/img/yeti6.png", review3, [review2]);
const yeti7: Yeti = new YetiClass(7, "Orang Pendek", 240, 300, "Sumatra", "/img/yeti7.png", review1, [review2, review3]);
const yeti8: Yeti = new YetiClass(8, "Meh-Teh", 310, 550, "Nepal", "/img/yeti8.png", review2, [review1]);
const yeti9: Yeti = new YetiClass(9, "Yeren", 260, 380, "China", "/img/yeti9.png", review3, [review1, review2]);

const yetiData: Yeti[] = [
  yeti1, yeti2, yeti3,
  yeti4, yeti5, yeti6,
  yeti7, yeti8, yeti9
];  

export default yetiData;
