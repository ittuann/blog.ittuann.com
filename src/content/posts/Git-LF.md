---
title: Git 多平台换行符问题
description: Git 的多平台换行符问题 (LF or CRLF)
pubDate: 2023-01-07
tags: ["Linux"]
category: ["Tech"]
---

Windows 下文本文件所使用的换行符是 CRLF，而 Linux/UNIX/macOS 用的是 LF。

使用 Git 的时候，默认当我们拉取远程文件的情况，会将 LF 格式的文件转换为 CRLF 格式的，在推送到远程时会进行一次转换将其变为 LF 格式推送上传。但这会在跨平台开发的时候造成一些问题，比如会影响正常 diff 的结果导致无法使用。

# 解决方法

在 Git 的工程根目录下增加`.gitattributes`文件。

在其中增加`* text=auto eol=lf`一行。这能保证 Windows 协作者在拉取时文件不会被转成 CRLF 格式。

我这个工程的 .gitattributes 文件内容如下：

```
* text=auto eol=lf
# Files with UNIX line endings
*.py    text    eol=lf
*.js    text    eol=lf
*.jsx   text    eol=lf
*.json  text    eol=lf
*.sh    text    eol=lf

# Binary files
*.bin	binary
```

# PyCharm 的设置

现代的 IDE 或文本编辑器对于换行符都已经有了很好的支持。

设置在 `File - Settings - Editor - Code Style`下

`Scheme`选择`Project`即代表该设置只对本项目工程生效。

`General - Line separator`选择`UNIX and macOS (\n)`

参考链接：

> [Windows 下前端开发使用 prettier 保证以 LF 结尾]: https://liuwenzhuang.github.io/2020/04/15/prettier-git-eof.html
> [Git 多平台换行符问题 (LF or CRLF)]: https://kuanghy.github.io/2017/03/19/git-lf-or-crlf
