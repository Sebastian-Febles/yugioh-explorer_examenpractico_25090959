export interface CardSet {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_price: string;
}

export interface CardImage {
  id: number;
  image_url: string;
  image_url_small: string;
}

export interface Card {
  id: number;
  name: string;
  type: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  attribute?: string;
  archetype?: string;
  card_sets?: CardSet[];
  card_images: CardImage[];
}

export interface CardResponse {
  data: Card[];
}

export type Estado = 'inicio' | 'cargando' | 'exito' | 'vacio' | 'error';
