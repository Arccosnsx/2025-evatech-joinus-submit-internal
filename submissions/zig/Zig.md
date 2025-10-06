我不明白为什么没有`debian`的包（）
完整的编译环境在我的nginx服务器上才有，但是不太想在上面装`Zig`
所以我就干脆用`Windows`了

这是我用过的最令人痛苦的语言。甚至标准库文档都是空白的......而且改标准输入输出流的API有任何意义吗？
谁会知道
```
pub fn stdin() File {
    return .{ .handle = if (is_windows) windows.peb().ProcessParameters.hStdInput else posix.STDIN_FILENO };
}
```
的`windows.peb().ProcessParameters.hStdInput`里面有`reader().interface`？？？

这个API甚至是我对着`stdout`猜出来的（）
