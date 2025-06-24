import platform
from digi.xbee.devices import XBeeDevice

xbee = None
def initialize_xbee():
    print("INIT XBEE")
    if (platform.system() != 'Windows'): # open Unix tty serial port
        xbee = XBeeDevice("/dev/tty.usbserial-B0025KAZ", 9600)
    else:
        xbee = XBeeDevice("COM1", 9600)
    xbee.open()
    print("XBEE INIT")
    return xbee


def shutdown_xbee():
    xbee.close();