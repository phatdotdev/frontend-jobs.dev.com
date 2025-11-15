import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type JobType } from "../../types/PostingProps";

export interface JobFormData {
  title: string;
  type: JobType;
  description: string;
  requirements: string;
  requiredDocuments: string;
  benefits: string;
  minSalary: string;
  maxSalary: string;
  experience: string;
  expiredAt: string;
  locationId: string;
  imageUrls: string[];
  newImages: File[];
  documents: any[];
  newImageUrls: string[];
  newDocuments: File[];
  newDocumentUrls: string[];
  companyName: string;
  avatarUrl: string;
  location: { name: string };
  likes?: number;
  views?: number;
  applied?: number;
}

interface PostState {
  draft: JobFormData | null;
}

const initialState: PostState = {
  draft: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setDraft: (state, action: PayloadAction<JobFormData>) => {
      state.draft = action.payload;
    },

    updateDraftField: (state, action: PayloadAction<Partial<JobFormData>>) => {
      if (state.draft) {
        state.draft = { ...state.draft, ...action.payload };
      }
    },

    clearDraft: (state) => {
      state.draft = null;
    },

    addNewImages: (state, action: PayloadAction<string[]>) => {
      if (state.draft) {
        state.draft.newImageUrls.push(...action.payload);
      }
    },

    removeExistingImage: (state, action: PayloadAction<string>) => {
      if (state.draft) {
        state.draft.imageUrls = state.draft.imageUrls.filter(
          (url) => url !== action.payload
        );
      }
    },

    removeNewImage: (state, action: PayloadAction<number>) => {
      if (state.draft) {
        state.draft.newImageUrls = state.draft.newImageUrls.filter(
          (_, i) => i !== action.payload
        );
      }
    },

    addNewDocuments: (state, action: PayloadAction<string[]>) => {
      if (state.draft) {
        state.draft.newDocumentUrls.push(...action.payload);
      }
    },

    removeNewDocument: (state, action: PayloadAction<number>) => {
      if (state.draft) {
        state.draft.newDocumentUrls = state.draft.newDocumentUrls.filter(
          (_, i) => i !== action.payload
        );
      }
    },
  },
});

export const {
  setDraft,
  updateDraftField,
  clearDraft,
  addNewImages,
  removeExistingImage,
  removeNewImage,
  addNewDocuments,
  removeNewDocument,
} = postSlice.actions;

export default postSlice.reducer;
