from message_parser import parse_can_message, group_can_data
import queue
import time
import threading
from tools import getDisplayColor, getMPPTErrors, getState
from xbee_interface import *
import web



def setTimeToZero():
    global secondsElapsed
    global totalMiles
    global currentNetAmps
    global totalNetAmps
    secondsElapsed = 0
    totalMiles = 0
    currentNetAmps = 0
    totalNetAmps = 0





# seconds elapsed
secondsElapsed = 0.0
totalMiles = 0.0
totalNetAmps = 0.0
currentNetAmps = 0.0
currentMPH = 0



def updateGuiData(dataQueue):
    """updates gui via a queue system"""
    data = None
    try:
        # non-blocking get from queue
        data = dataQueue.get_nowait()
    except queue.Empty:
        pass
    else:
        # data received, update labels
        update_label(data=data)

    # seconds elapsed
    global secondsElapsed # get seconds elapsed
    secondsElapsed += 0.1
    # for total miles
    global totalMiles # gets total miles
    global currentMPH
    # for avg net amps
    global totalNetAmps
    global currentNetAmps

    totalMiles = (currentMPH * 0.1/3600) + totalMiles # get total miles
    avgMPH = totalMiles/(secondsElapsed/3600) # get average mph
    avgMilesStartButton.config(text=f"{avgMPH:.1f}" + "mph") # sets button to avgMiles

    totalNetAmps = (currentNetAmps + totalNetAmps)
    avgAmps = totalNetAmps/(secondsElapsed * 10)
    #print(currentNetAmps)
    avgAmpsLabel.config(text=f"{avgAmps:.1f}" + "amps")



"""
def worker_thread(queue, bus):
    #A worker thread that generates canData and puts it on the queue.
    print("Running worker thread.")
    while True:
        data = canCollection(bus)
        queue.put(data) # puts data in queue
"""

def xbee_data_callback(message, queue):
    data = xbeeCollection(message.data)
    queue.put(data)

def worker_thread(queue, xbee):
    print("Running worker thread")
    xbee.add_data_received_callback((lambda message : xbee_data_callback(message, queue)))
    print("registered callback")
    
def xbeeCollection(xbee_message):
    try:
        message = can.Message(arbitration_id=int.from_bytes(xbee_message[0:4]),data=xbee_message[5:])
        parsed_message = parse_can_message(message)
        print(parsed_message["arbitration_id"], parsed_message["data_str"])
        data = parsed_message['data']
        try:
            groupedData = group_can_data(int.from_bytes(parsed_message["arbitration_id"]), data=data)
        except TypeError:
            groupedData = group_can_data(parsed_message["arbitration_id"], data=data)
        #print(groupedData['Speed'])
        return groupedData
    
    except KeyboardInterrupt:
        shutdown_xbee()
        print("\n\rKeyboard interrupt")
        

# data queue for data
dataQueue = queue.Queue()

def main():
    xbee = initialize_xbee()
    secondsElapsed = 0.0
    print("The initialize_xbee done")
    print("Sending request frame0 in main...")
    worker = threading.Thread(target=worker_thread, args=(dataQueue, xbee))
    worker.start()
    web.initDashUI()

if __name__ == "__main__":
    main()


