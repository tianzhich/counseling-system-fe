#!/usr/bin/expect
set user root
set host 47.94.223.143
set password $env(CENTOS_PWD)

# build
set build_src_path build/*
set build_dest_path /usr/local/webserver/nginx/html

# nginx conf
set nginx_src_path nginx.conf
set nginx_dest_path /usr/local/webserver/nginx/conf

# 防止build时间过久自动退出，设置无限时长替代默认的30s
set timeout -1

# spawn npm run build
# expect eof

# solve https://stackoverflow.com/questions/25791699/automate-scp-with-multiple-files-with-expect-script
spawn bash -c "scp -r $build_src_path $user@$host:$build_dest_path"
expect {
    "*password:" { send "$password\n" }
}
interact

spawn scp $nginx_src_path $user@$host:$nginx_dest_path
expect {
    "*password:" { send "$password\n" }
}
interact

puts "\ndeploy success!"
