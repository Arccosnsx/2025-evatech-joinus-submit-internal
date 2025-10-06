const std = @import("std");

pub fn main() !void {
    var rng = std.crypto.random;
    const key = rng.intRangeAtMost(u32, 1, 100);

    var stdout_buffer: [1024]u8 = undefined;
    var stdout_writer = std.fs.File.stdout().writer(&stdout_buffer);
    const stdout = &stdout_writer.interface;

    try stdout.print("Start! 0~100\n", .{});
    try stdout.flush();

    var stdin_buffer: [256]u8 = undefined;
    var stdin_reader = std.fs.File.stdin().reader(&stdin_buffer);
    var stdin = &stdin_reader.interface;
    var input = try stdin.takeDelimiterExclusive('\n');
    var trim = std.mem.trim(u8, input, " \t\r\n");
    var input_i = try std.fmt.parseInt(u32, trim, 10);
    while (input_i != key) {
        if (input_i > key) {
            try stdout.print("Too big\n", .{});
            try stdout.flush();
        } else {
            try stdout.print("Too small\n", .{});
            try stdout.flush();
        }
        input = try stdin.takeDelimiterExclusive('\n');
        trim = std.mem.trim(u8, input, " \t\r\n");
        input_i = try std.fmt.parseInt(u32, trim, 10);
    }
    try stdout.print("Right!\n", .{});
    try stdout.flush();
}
