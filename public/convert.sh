for file in *png; do
    filename="${file%.*}"
    cwebp $file -o images/"$filename".webp
    echo converted "$file" to images/"$filename".webp
done