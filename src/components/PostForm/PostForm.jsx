import React from 'react';
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Input, Button, RTE, Select } from "../";
import { useNavigate } from "react-router-dom";
import appwriteService from '../../appwrite/config';

function PostForm({ post }) {
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const slugTransform = (value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        }
        return "";
    };

    const { register, handleSubmit, control, watch, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: slugTransform(post?.title) || "",
            content: post?.content || "",
            status: post?.status || "active"
        },
    });

    const submit = async (data) => {
        try {
            // Convert status to boolean
            data.status = data.status === "active" ? true : false;

            if (post) {
                if (data.image && data.image[0]) {
                    const file = await appwriteService.uploadFile(data.image[0]);
                    if (file) {
                        await appwriteService.deleteFile(post.featuredImage);
                        data.featuredImage = file.$id;
                    }
                }

                const updatedPost = await appwriteService.updatePost(post.$id, data);
                navigate(`/post/${updatedPost.$id}`);
            } else {
                const file = await appwriteService.uploadFile(data.image[0]);
                if (file) {
                    data.featuredImage = file.$id;
                    const userId = userData['$id'];
                    const author = userData.name;
                    const slug = data.slug;

                    await appwriteService.createPost({ ...data, userId, author });
                    navigate(`/post/${slug}`);
                } else {
                    console.error("Error uploading file:", file);
                }
            }
        } catch (error) {
            console.error("Error submitting post:", error);
        }
    };

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: "Title is required" })}
                />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}

                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: "Slug is required" })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}

                <RTE
                    label="Content :"
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                    rules={{ required: "Content is required" }}
                />
                {errors.content && <p className="text-red-500">{errors.content.message}</p>}
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    {...register("image", { required: !post ? "Featured image is required" : false })}
                />
                {errors.image && <p className="text-red-500">{errors.image.message}</p>}

                {post && post.featuredImage && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: "Status is required" })}
                />
                {errors.status && <p className="text-red-500">{errors.status.message}</p>}

                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}

export default PostForm;
