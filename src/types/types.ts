// Google Places Autocomplete

export type PlaceOption = {
  label: string;
  value: PlaceResult;
};

type PlaceResult = {
  description: string;
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  terms: {
    offset: number;
    value: string;
  }[];
  types: string[];
};

// Context

export type LocationState = {
  coords: {
    lat: number | null;
    lng: number | null;
  };
  name: string | null;
  saved: boolean;
  loading: boolean;
  error: string | null;
  usingLocation: boolean;
  place: PlaceOption | null;
};

// Formik types

export interface FinderFormValues {
  priceLevel: {
    label: string;
    value: number;
  };
  distance: {
    label: string;
    value: number;
  };
  location: string;
  keyword: {
    label: string;
    value: string;
  };
  coordinates: { latitude: number; longitude: number };
}

// Server types

export type RestoBusinessDetails = {
  id: string;
  phone: string;
  website: string;
  ratings: number;
};
export type RestoBusiness = {
  id: string;
  name: string;
  types: string[];
  address: string;
  image: null | string;
  distance: number;
  rating: number;
  priceLevel: number;
  lat: number;
  lng: number;
};

export type Resto = RestoBusiness & RestoBusinessDetails;

// Yelp API data

export type YelpBusiness = {
  id: string;
  alias: string;
  name: string;
  image_url: string;
  is_closed: boolean;
  url: string;
  review_count: number;
  categories: { alias: string; title: string }[];
  rating: number;
  coordinates: { latitude: number; longitude: number };
  transactions: string[];
  price: string;
  location: {
    address1: string;
    address2: string;
    address3: string;
    city: string;
    zip_code: string;
    country: string;
    state: string;
    display_address: string[];
  };
  phone: string;
  display_phone: string;
  distance: number;
};

export type YelpSearchRequest = {
  businesses: YelpBusiness[];
  total: number;
  region: {
    center: {
      longitude: number;
      latitude: number;
    };
  };
};
