import math
from math import pi
import threading
import time
import struct
import numpy as np

# these might be better to define in main
TIRE_DIAMETER = 21.5 # in inches
NUM_OF_INCHES_IN_MILE = 63360
MINUTES_IN_HOUR = 60
PI = math.pi

# tools for use in can data gathering
def shift_bits(data, shift_amount):
    """
    Shifts the bits of each byte in the data by the specified amount.
    """
    shifted_data = bytearray()
    for byte in data:
        shifted_byte = (byte << shift_amount) & 0xFF | (byte >> (8 - shift_amount))
        shifted_data.append(shifted_byte)
    return shifted_data

def getBits(canMessage: bytearray, low: int, high: int) -> int:
    """
    Extracts bits from `low` to `high` (inclusive) from the given.
    """
    return int.from_bytes(canMessage[(low//8):(high//8)+1], byteorder='big')


def getSignedBits(canMessage: bytearray, index: int, index2: int):
    """
    Get Signed bits from an index
    """
    #singleByte = [(canMessage[index])]
    soc = np.uint16((canMessage[index]))
    soc = soc << 8
    soc = soc + np.uint16((canMessage[index2]))
    #soc = [((canMessage[index] << 8) + canMessage[index2])] #right shift so we can add bits
    #print("byte 0 " + str(canMessage[index]))
    #soc = ((canMessage[index] * 255) + canMessage[index2])
    #print("byte 1" + str(canMessage[index2]))
    #print("soc" + str(soc[0]))
    #print(int.from_bytes(bytearray(soc), byteorder='big', signed=True))

    val = np.int16(soc)
    #val = ~val
    #print("int16 " + str(val))
    #singleByte2 = [(canMessage[index2])]
    #canByteMessage = bytearray([singleByte, singleByte2])
    
    #print(canByteMessage[index])
    
    #print(int.from_bytes(singleByte, byteorder='big', signed=True))

    return val


def get32FloatBits(canMessage: bytearray, low: int, high: int) -> float:
    """
    Extracts bits from `low` to `high` (inclusive) from the given bytearray
    and converts them to a float. Assumes `high - low + 1 == 32`.
    """
    # Ensure the range is exactly 32 bits
    if high - low + 1 != 32:
        raise ValueError("The range must be exactly 32 bits to convert to a float.")
    
    # Create a mask for 32 bits
    mask = (1 << 32) - 1

    # Extract the 32 bits and shift them into position
    extracted_bits = (int.from_bytes(canMessage, byteorder='big') >> low) & mask
    
    # Convert the extracted bits to a 4-byte array
    float_bytes = extracted_bits.to_bytes(4, byteorder='big')
    
    # Unpack the 4-byte array as a float
    return struct.unpack('<f', float_bytes)[0]


def get16FloatBits(canMessage: bytearray, low: int) -> float:
    """
    Extracts a 16-bit float starting from `low` bit in the given bytearray.
    """
    # Ensure the range is exactly 16 bits
    num_bits = 16
    
    # Calculate the byte range
    start_byte = low // 8
    end_byte = (low + num_bits - 1) // 8
    
    # Extract the relevant bytes
    float_bytes = canMessage[start_byte:end_byte + 1]
    
    # If the extracted bytes are not exactly 2, pad with zero bytes if necessary
    if len(float_bytes) < 2:
        float_bytes += bytes(2 - len(float_bytes))
    
    # Unpack the 2-byte array as a float
    return struct.unpack('<e', float_bytes)[0]

# if given bits, will return the correct speed of a vehicle given diameter of tires
def getSpeed(RPM):
    """
    Obtains speed given RPM
    """
    return RPM * TIRE_DIAMETER * PI * MINUTES_IN_HOUR/NUM_OF_INCHES_IN_MILE

# for display colors for whether a component is on
def getDisplayColor(bit):
    if(bit == 0):
        return 'lime'
    else: # if bit == 1
        return 'yellow'

def getMPPTErrors(boolean):
    if boolean:
        return 'black'
    else:
        return '#E5E5E5'


stateArr = ['OFF', 'ACC', 'IGN', 'DCDC', 'ON', 'CHARGE', 'FAULT']
def getState(num):
    return stateArr[num]


def updateBMSFaults(canMessage: bytearray, bmsFaults):
    # DTC 1
    bmsFaults["DischargeLimitEnforcement"] = getBits(canMessage[0], 0, 0)
    bmsFaults["Charger Safety Relay Fault"] = getBits(canMessage[0], 1, 1)
    bmsFaults["Internal Hardware Fault"] = getBits(canMessage[0], 2, 2)
    bmsFaults["Internal Heatsink Thermistor Fault"] = getBits(canMessage[0], 3, 3)
    bmsFaults["Internal Software Fault"] = getBits(canMessage[0], 4, 4)
    bmsFaults["Highest Cell Voltage Too High Fault"] = getBits(canMessage[0], 5, 5)
    bmsFaults["Lowest Cell Voltage Too Low Fault"] = getBits(canMessage[0], 6, 6)
    bmsFaults["Pack Too Hot Fault"] = getBits(canMessage[0], 7, 7)
    
    # DTC 2
    bmsFaults["Internal Communication Fault"] = getBits(canMessage[1], 0, 0)
    bmsFaults["Cell Balancing Stuck Off Fault"] = getBits(canMessage[1], 1, 1)
    bmsFaults["Weak Cell Fault"] = getBits(canMessage[1], 2, 2)
    bmsFaults["Low Cell Voltage Fault"] = getBits(canMessage[1], 3, 3)
    bmsFaults["Open Wiring Fault"] = getBits(canMessage[1], 4, 4)
    bmsFaults["Current Sensor Fault"] = getBits(canMessage[1], 5, 5)
    bmsFaults["Highest Cell Voltage Over 5V Fault"] = getBits(canMessage[1], 6, 6)
    bmsFaults["Cell ASIC Fault"] = getBits(canMessage[1], 7, 7)
    bmsFaults["Weak Pack Fault"] = getBits(canMessage[1], 8, 8)
    bmsFaults["Fan Monitor Fault"] = getBits(canMessage[1], 9, 9)
    bmsFaults["Thermistor Fault"] = getBits(canMessage[1], 10, 10)
    bmsFaults["External Communication Fault"] = getBits(canMessage[1], 11, 11)
    bmsFaults["Redundant Power Supply Fault"] = getBits(canMessage[1], 12, 12)
    bmsFaults["High Voltage Isolation Fault"] = getBits(canMessage[1], 13, 13)
    bmsFaults["Input Power Supply Fault"] = getBits(canMessage[1], 14, 14)
    bmsFaults["Charge Limit Enforcement Fault"] = getBits(canMessage[1], 15, 15)