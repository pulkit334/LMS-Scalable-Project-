// /* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// import { Upload } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { CreateCourse } from "../../../services/auth";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import { Link } from "react-router-dom";
// import Asideinformation from "../../../utils/Asideinformation";
// const CourseInformation = ({ onSuccess }) => {
//   const { categories } = useSelector((state) => state.profile);
//   const [preview, setPreview] = useState(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isDirty, dirtyFields, isSubmitSuccessful },
//   } = useForm({
//     defaultValues: {
//       courseName: "",
//       courseDescription: "",
//       whatyouwilllearn: "",
//       price: 0,
//       category: "",
//       tag: "",
//       thumbnail: null,
//       benefits: "",
//       requirements: "",
//     },
//   });

//   const onSubmit = async (data) => {
//     const toastId = toast.loading("Creating course...");

//     try {
//       //  Convert to FormData
//       const formData = new FormData();

//       Object.entries(data).forEach(([key, value]) => {
//         if (key === "thumbnail") {
//           formData.append("thumbnailImage", value[0]); // FileList → File
//         } else {
//           formData.append(key, value);
//         }
//       });

//       const response = await CreateCourse(formData);
//       if (!response) {
//         throw new Error("No response from server");
//       }
//       if (response?.courseId) {
//         onSuccess(response?.courseId);
//         toast.success("Successfully created course 🎉", { id: toastId });
//       }
//     } catch (err) {
//       toast.error("Error occurred. Try again.", { id: toastId });
//     }
//   };

//   return (
//     <section className="min-h-screen bg-[#0b1220] text-white px-1 py-1">
//       {/* ================= HEADER ================= */}
//       <div className="mb-8">

//         <p className="text-sm text-slate-400 cursor-pointer">
//         <Link to ="/login">  ← Back to Dashboard</Link>
//         </p>

//         {/* Stepper */}
//         <div className="mt-6 flex items-center gap-6 text-sm">
//           <div className="flex items-center gap-2">
//             <span className="h-6 w-6 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold">
//               1
//             </span>
//             <span>Course Information</span>
//           </div>

//           <div className="h-px w-10 bg-slate-700" />

//           <div className="flex items-center gap-2 text-slate-500">
//             <span className="h-6 w-6 rounded-full border border-slate-600 flex items-center justify-center">
//               2
//             </span>
//             <span>Course Builder</span>
//           </div>

//           <div className="h-px w-10 bg-slate-700" />

//           <div className="flex items-center gap-2 text-slate-500">
//             <span className="h-6 w-6 rounded-full border border-slate-600 flex items-center justify-center">
//               3
//             </span>
//             <span>Publish</span>
//           </div>
//         </div>
//       </div>

//       <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* ================= FORM ================= */}
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-xl p-6 space-y-5"
//         >
//           {/* Course Title */}
//           <div>
//             <label className="text-sm mb-1 block">
//               Course Title <span className="text-yellow-400">*</span>
//             </label>
//             <input
//               {...register("courseName", {
//                 required: "Course title is required",
//               })}
//               placeholder="Enter Course Title"
//               className="w-full h-11 rounded-md bg-[#020617] border border-slate-700 px-4"
//             />
//             {errors.courseName && (
//               <p className="text-xs text-red-400 mt-1">
//                 {errors.courseName.message}
//               </p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="text-sm mb-1 block">
//               Course Short Description{" "}
//               <span className="text-yellow-400">*</span>
//             </label>
//             <textarea
//               {...register("courseDescription", { required: true })}
//               rows={4}
//               placeholder="Enter Description"
//               className="w-full rounded-md bg-[#020617] border border-slate-700 px-4 py-2 resize-none"
//             />
//           </div>

//           {/* What you will learn */}
//           <div>
//             <label className="text-sm mb-1 block">What you will learn</label>
//             <textarea
//               {...register("whatyouwilllearn")}
//               rows={3}
//               className="w-full rounded-md bg-[#020617] border border-slate-700 px-4 py-2"
//             />
//           </div>

//           {/* Price */}
//           <div>
//             <label className="text-sm mb-1 block">Price</label>
//             <input
//               type="number"
//               {...register("price", { valueAsNumber: true })}
//               className="w-full h-11 rounded-md bg-[#020617] border border-slate-700 px-4"
//             />
//           </div>

//           {/* Category */}
//           <div>
//             <label className="text-sm mb-1 block">
//               Category <span className="text-yellow-400">*</span>
//             </label>
//             <select
//               {...register("category", { required: true })}
//               className="w-full bg-[#0f172a] rounded-md border p-2"
//             >
//               <option value="">Choose a Category</option>

//               {categories.map((item) => (
//                 <option key={item._id} value={item._id}>
//                   {item.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Tags */}
//           <div>
//             <label className="text-sm mb-1 block">Tags</label>
//             <input
//               {...register("tag")}
//               className="w-full h-11 rounded-md bg-[#020617] border border-slate-700 px-4"
//             />
//           </div>

//           {/* Thumbnail */}
//           <div>
//             <label className="text-sm mb-2 block">
//               Course Thumbnail <span className="text-yellow-400">*</span>
//             </label>

//             <label
//               className={`flex flex-col items-center justify-center border border-dashed border-slate-600 rounded-lg    cursor-pointer ${
//                 preview ? "p-2" : "p-20"
//               } `}
//             >
//               {!preview && (
//                 <>
//                   <Upload className="text-yellow-400 mb-2" />
//                   <p className="text-sm text-slate-400">
//                     Drag and drop an image, or{" "}
//                     <span className="text-yellow-400">Browse</span>
//                   </p>
//                 </>
//               )}

//               <input
//                 type="file"
//                 accept="image/*"
//                 hidden
//                 {...register("thumbnail", {
//                   required: true,
//                   onChange: (e) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                       setPreview(URL.createObjectURL(file));
//                     }
//                   },
//                 })}
//               />
//               {preview && (
//                 <img src={preview} alt="Thumbnail preview" className="" />
//               )}
//             </label>
//           </div>

//           {/* Benefits */}
//           <div>
//             <label className="text-sm mb-1 block">Benefits of the course</label>
//             <textarea
//               {...register("benefits")}
//               rows={3}
//               className="w-full rounded-md bg-[#020617] border border-slate-700 px-4 py-2"
//             />
//           </div>

//           {/* Requirements */}
//           <div>
//             <label className="text-sm mb-1 block">
//               Requirements / Instructions
//             </label>
//             <input
//               {...register("requirements")}
//               className="w-full h-11 rounded-md bg-[#020617] border border-slate-700 px-4"
//             />
//           </div>

//           {/* Submit */}
//           <div className="pt-4 flex justify-end">
//             <button
//               type="submit"
//               className="bg-yellow-400 text-black font-semibold px-8 py-2 rounded-md"
//             >
//               Next →
//             </button>
//           </div>
//         </form>

//         {/* ================= TIPS ================= */}
//         <Asideinformation />
//       </div>
//     </section>
//   );
// };

// export default CourseInformation;
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { CreateCourse, UpdateUser } from "../../../services/auth";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Asideinformation from "../../../utils/Asideinformation";
import { setCourseId, setStep } from "../../../Slices/courseSlice";

const CourseInformation = () => {
  const dispatch = useDispatch(); // ADDED
  const { categories } = useSelector((state) => state.profile);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      courseName: "",
      courseDescription: "",
      whatyouwilllearn: "",
      price: 0,
      category: "",
      tag: "",
      thumbnail: null,
      benefits: "",
      requirements: "",
    },
  });
  const { course, isEdit, resetCourse, courseId } = useSelector(
    (state) => state.course
  );

  useEffect(() => {
    // If not editing, ensure no stale data
    if (!isEdit && course) {
      dispatch(resetCourse());
    }
  }, []);
  useEffect(() => {
    if (isEdit && course) {
      reset({
        courseName: course.courseName ?? "",
        courseDescription: course.courseDescription ?? "",
        price: course.price ?? 0,
        file: course.thumbnail,
        // category is an OBJECT in backend
        category: course.category?._id ?? "",

        tag: course.tag ?? "",
        whatyouwilllearn: course.whatyouwilllearn ?? "",

        //  backend key is "requirement"
        requirements: course.requirement ?? "",

        // benefits DOES NOT exist separately in backend
        // it is embedded inside whatyouwilllearn text
        benefits: "",
      });
    }
  }, [course, isEdit, reset]);
  let toastId;
  const onSubmit = async (data) => {
    if (!isEdit) {
      toastId = toast.loading("Creating course...");
    } else {
      toastId = toast.loading("Updating...");
    }

    try {
      //  Convert to FormData
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "thumbnail") {
          formData.append("thumbnailImage", value[0]); // FileList → File
        } else {
          formData.append(key, value);
        }
      });
      let response;
      if (!isEdit) {
        response = await CreateCourse(formData);
      } else {
        response = await UpdateUser(courseId, formData);
      }

      if (!response) {
        throw new Error("No response from server");
      }
      console.log("The resposne is", response);
      if (response?.course) {
        //  ONLY CHANGE (Redux instead of prop)
        dispatch(setCourseId(response.course._id));
        dispatch(setStep(2));
        if (!isEdit)
          toast.success("Successfully created course 🎉", { id: toastId });
        else toast.success("Successfully Updated 🎉", { id: toastId });
      }
    } catch (err) {
      toast.error("Error occurred. Try again.", { id: toastId });
    }
  };

  return (
    <section className="min-h-screen bg-[#0b1220] text-white px-1 py-1">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <p className="text-sm text-slate-400 cursor-pointer">
          <Link to="/login"> ← Back to Dashboard</Link>
        </p>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold">
              1
            </span>
            <span>Course Information</span>
          </div>

          <div className="h-px w-10 bg-slate-700" />

          <div className="flex items-center gap-2 text-slate-500">
            <span className="h-6 w-6 rounded-full border border-slate-600 flex items-center justify-center">
              2
            </span>
            <span>Course Builder</span>
          </div>

          <div className="h-px w-10 bg-slate-700" />

          <div className="flex items-center gap-2 text-slate-500">
            <span className="h-6 w-6 rounded-full border border-slate-600 flex items-center justify-center">
              3
            </span>
            <span>Publish</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-xl p-6 space-y-5"
        >
          {/* Course Title */}
          <div>
            <label className="text-sm mb-1 block">
              Course Title <span className="text-yellow-400">*</span>
            </label>
            <input
              {...register("courseName", {
                required: "Course title is required",
              })}
              placeholder="Enter Course Title"
              className="w-full h-11 rounded-md bg-[#020617] border border-slate-700 px-4"
            />
            {errors.courseName && (
              <p className="text-xs text-red-400 mt-1">
                {errors.courseName.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm mb-1 block">
              Course Short Description{" "}
              <span className="text-yellow-400">*</span>
            </label>
            <textarea
              {...register("courseDescription", { required: true })}
              rows={4}
              placeholder="Enter Description"
              className="w-full rounded-md bg-[#020617] border border-slate-700 px-4 py-2 resize-none"
            />
          </div>

          {/* What you will learn */}
          <div>
            <label className="text-sm mb-1 block">What you will learn</label>
            <textarea
              {...register("whatyouwilllearn")}
              rows={3}
              className="w-full rounded-md bg-[#020617] border border-slate-700 px-4 py-2"
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-sm mb-1 block">Price</label>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              className="w-full h-11 rounded-md bg-[#020617] border border-slate-700 px-4"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm mb-1 block">
              Category <span className="text-yellow-400">*</span>
            </label>
            <select
              {...register("category", { required: true })}
              className="w-full bg-[#0f172a] rounded-md border p-2"
            >
              <option value="">Choose a Category</option>
              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm mb-1 block">Tags</label>
            <input
              {...register("tag")}
              className="w-full h-11 rounded-md bg-[#020617] border border-slate-700 px-4"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="text-sm mb-2 block">
              Course Thumbnail <span className="text-yellow-400">*</span>
            </label>

            <label
              className={`flex flex-col items-center justify-center border border-dashed border-slate-600 rounded-lg cursor-pointer ${
                preview ? "p-2" : "p-20"
              }`}
            >
              {!preview && (
                <>
                  <Upload className="text-yellow-400 mb-2" />
                  <p className="text-sm text-slate-400">
                    Drag and drop an image, or{" "}
                    <span className="text-yellow-400">Browse</span>
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                hidden
                {...register("thumbnail", {
                  required: true,
                  onChange: (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    } else {
                      setPreview(URL.createObjectURL(file));
                    }
                  },
                })}
              />

              <img src={preview || course?.thumbnail} />
            </label>
          </div>

          {/* Benefits */}
          <div>
            <label className="text-sm mb-1 block">Benefits of the course</label>
            <textarea
              {...register("benefits")}
              rows={3}
              className="w-full rounded-md bg-[#020617] border border-slate-700 px-4 py-2"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="text-sm mb-1 block">
              Requirements / Instructions
            </label>
            <input
              {...register("requirements")}
              className="w-full h-11 rounded-md bg-[#020617] border border-slate-700 px-4"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-yellow-400 text-black font-semibold px-8 py-2 rounded-md"
            >
              →
            </button>
          </div>
        </form>

        {/* ================= TIPS ================= */}
        <Asideinformation />
      </div>
    </section>
  );
};

export default CourseInformation;
