import platform
import can
from message_parser import *
from digi.xbee.devices import XBeeDevice
from dash import html

xbee = None
def initialize_xbee():
    print("INIT XBEE")
    if (platform.system() != 'Windows'): # open Unix tty serial port
        xbee = XBeeDevice("/dev/tty.usbserial-B0025KAZ", 9600)
    else:
        xbee = XBeeDevice("COM1", 9600)
    xbee.open()
    xbee.add_data_received_callback((lambda message : xbee_data_callback(message)))
    print("XBEE INIT")
    return xbee

log_queue = []
def xbee_data_callback(message):
    try:
        can_message = can.Message(arbitration_id=int.from_bytes(message.data[0:4]),data=message.data[5:])
        parsed_message = parse_can_message(can_message)
        #print(parsed_message["arbitration_id"], parsed_message["data_str"])
        data = parsed_message['data']
        try:
            group_can_data(int.from_bytes(parsed_message["arbitration_id"]), data)
        except TypeError:
            group_can_data(parsed_message["arbitration_id"], data)

        #if (parsed_message['arbitration_id'] == 0x289):
            #print(data.hex())
        # Add to log queue to show on UI
        if len(log_queue) == 5:
            log_queue.pop(0)
        log_queue.append(html.P(f"({parsed_message["arbitration_id"]:#x}) {parsed_message['data_str']}"))
    
    except KeyboardInterrupt:
        shutdown_xbee()
        print("\n\rKeyboard interrupt")

def shutdown_xbee():
    xbee.close();