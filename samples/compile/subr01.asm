    dataSize(program)
    dup1
    dataOffset(program)
    0x0
    codecopy
    0x0
    return
    stop

program: assembly {
    0x04
    jumpsub
    stop
    beginsub
    returnsub
}


