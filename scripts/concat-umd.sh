files="
node_modules/react/umd/react.production.min.js
node_modules/react-dom/umd/react-dom.production.min.js
";
umd=public/assets/lib.umd.min.js
if [ -f $umd ];then
  rm $umd
fi
for file in $files;do
  echo "" >> $umd
  if [ "${file/.min/}" == $file ];then
    cat $file >> $umd
  else 
    node_modules/.bin/uglifyjs $file >> $umd
  fi
done

cp -rf node_modules/\@ant-design/icons/lib/umd.js public/assets/antd.icons.min.js