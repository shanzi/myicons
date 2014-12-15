#!/usr/bin/env python
# encoding: utf-8

import io
import struct

class ByteBuffer(io.BytesIO):

    def makefmt(self, width, littleEndian=False):
        fmt = '<' if littleEndian else '>'
        if width == 8: fmt += 'B'
        elif width == 16: fmt += 'H'
        elif width == 32: fmt += 'I'
        else: fmt += 'L'
        return fmt

    def maskValue(self, width, value):
        if width == 8: return value & 0xFF
        elif width == 16: return value & 0xFFFF
        elif width == 32: return value & 0xFFFFFFFF
        return value

    def getuint(self, width, pos):
        oldpos = self.tell()
        self.seek(pos)
        fmt = self.makefmt(width, False)
        value = struct.unpack(fmt, self.read(width/8))
        self.seek(oldpos)
        return value[0]

    def setuint(self, width, pos, value, littleEndian=False):
        self.seek(pos)
        fmt = self.makefmt(width, littleEndian)
        maskedValue = self.maskValue(width, value)
        self.write(struct.pack(fmt, maskedValue))

    def writeuint(self, width, value, littleEndian=False):
        fmt = self.makefmt(width, littleEndian)
        self.write(struct.pack(fmt, value))

    def readat(self, pos, length):
        oldpos = self.tell()
        self.seek(pos)
        value = self.read(length)
        self.seek(oldpos)
        return value
