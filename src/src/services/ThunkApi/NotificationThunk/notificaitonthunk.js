import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Usernotification } from "../../Notificaiton/Notificaitonservice";

//  Thunk APi's FOr Notficaiotn
export const  FetchNotification = createAsyncThunk(
  "user/fetchNotification",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Usernotification();
      console.log("the fetchNotification Result is ", res);
      return res;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to fetch User-Notficaiton",
      );
    }
  },
);

const UserNotficationSlice = createSlice({
  name: "usernotification",
  initialState: {
    loading: false,
    error: null,
    UserNotification: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FetchNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.UserNotification = action.payload; // store courses
      })
      .addCase(FetchNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default UserNotficationSlice.reducer;
