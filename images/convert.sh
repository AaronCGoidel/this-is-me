for file in *png; do
    filename="${file%.*}"
    cwebp $file -o ../public/images/"$filename".webp
    echo converted "$file" to /images/"$filename".webp
done