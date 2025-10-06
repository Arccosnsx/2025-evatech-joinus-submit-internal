进行的操作：在电脑上进入浙大云盘拿到直链，用`wget`下载（因为我用的是`ssh`）。
```bash
>> 7z e alpine.img.7z

>> fdisk -l alpine.img
Disk alpine.img: 1 GiB, 1073741824 bytes, 2097152 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: E5B94B3F-C3FC-407F-93A2-406B214EE03D

Device       Start     End Sectors  Size Type
alpine.img1   2048  329727  327680  160M EFI System
alpine.img2 329728  854015  524288  256M Linux swap
alpine.img3 854016 2095103 1241088  606M Linux filesystem
```

显然第三个是`root`分区，直接挂载

```bash
>> mkdir temp
>> mount -o loop,offset=437256192 alpine.img temp
>> cat temp/root/secret.txt
60d958a5-8993-4767-89db-9636be62b507
```


secret.txt：`60d958a5-8993-4767-89db-9636be62b507`（UUID）

```bash
>> cp /temp/secretfile ~/
>> umount temp
>> cryptsetup luksOpen secretfile temptemp
>> mount /dev/mapper/temptemp temp
>> cd temp
>> ls
very_suspicious_file
>> cat very_suspicious_file
bG9va1NMaWtFYWZMYWd7Y2xpXzFzX3kwdXJfZnJpZW5kfQ==
```


very_suspicious_file：`bG9va1NMaWtFYWZMYWd7Y2xpXzFzX3kwdXJfZnJpZW5kfQ==`

base64解密：`lookSLikEafLag{cli_1s_y0ur_friend}` （XD）