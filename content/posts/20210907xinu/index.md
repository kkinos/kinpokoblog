---
title: "Xinu x86をQEMUで実行する"
date: 2021-09-07T18:03:22+09:00
draft: false
tags: ["xinu", "operating system", "qemu"]
slug: "run-xinu-x86-on-qemu"
---

## 背景

[Xinuオペレーティングシステムデザイン 改訂2版](https://www.amazon.co.jp/Xinu%E3%82%AA%E3%83%9A%E3%83%AC%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3-%E6%94%B9%E8%A8%822%E7%89%88-%E7%A5%9E%E6%9E%97-%E9%9D%96/dp/4048930729)を買いました。とりあえずXinuのx86をQEMUで動かしてみたいと思い色々調べてみましたが、情報が古くちょっと困ったのでブログとして残しておこうと思います。基本的には参考サイトと同じですが、自分と同じ環境でXinuのx86をQEMU上で動かしてみたいという人向けです。

## 参考

[Run XINU OS x86 system based on QEMU under Ubuntu](https://titanwolf.org/Network/Articles/Article?AID=c179e441-a002-41c9-81ca-257904e4b4dc#gsc.tab=0)

## 環境

```bash
wsl2
Description:    Ubuntu 20.04.3 LTS
Release:        20.04
gcc (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0
```

## 方法

[XinuのGitHubのリポジトリ](https://github.com/xinu-os/xinu)からソースコードを落としてきてそれぞれのファイルを以下のように修正してください。

### 1.LDFLAGS追加

`xinu/compile/platforms/x86`

```
CFLAGS        += -m32
ASFLAGS       += --32
LDFLAGS       += -melf_i386
```

### 2.マルチブート対応

`xinu/loader/platforms/x86/start.S`

```s
/* Embedded XINU, Copyright (C) 2007.  All rights reserved. */

.text
	.align	4
	.globl  _start
	.extern startup
	.extern _end

#define     MULTIBOOT_HEADER_MAGIC  0x1BADB002
#define     MULTIBOOT_HEADER_FLAGS  0x00000003
_start:
	/* disable any interrupts from coming in */
	cli

	movl	$_end,    %eax  # set stack pointer to 64k after end of image
	addl	$64*1024, %eax
	decl	%eax            # 16-byte align stack pointer
	shrl	$0x04, %eax
	shll	$0x04, %eax
	movl	%eax,     %esp  # set stack pointer

	jmp		startup

/* Enable multiboot support */
	.align  4
	.long   MULTIBOOT_HEADER_MAGIC
	.long   MULTIBOOT_HEADER_FLAGS
	.long   -(MULTIBOOT_HEADER_MAGIC + MULTIBOOT_HEADER_FLAGS)

```

### 3.コンパイルを通すためのダミー関数追加

`xinu/lib/libxc/abs.c`

```c
void __stack_chk_fail(void){};
```

以上です。あとは

```bash
make -C compile PLATFROM=x86
```

とすればコンパイルできるはずです。実行は`compile`フォルダに移動して

```bash
qemu-system-i386 -kernel xinu.elf
```

とすればとりあえず動きます。

![Xinu画面](xinu画面.png)
