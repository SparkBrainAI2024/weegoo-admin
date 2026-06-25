export interface Occasion {
    _id: string;
    occasionName: string;
}

export interface OccasionResponse {
    occasion: Occasion[];
}