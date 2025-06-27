from message_parser import *
import time
import threading
import xbee_interface as xb
import web
import calculations as calc


def main():
    print("The initialize_xbee done")
    xb_worker = threading.Thread(target=xb.initialize_xbee)
    xb_worker.start()

    #data_worker = threading.Thread(target=calc.initCalc)
    #data_worker.start()

    data_saver = threading.Thread(target=calc.saveData)
    data_saver.start()

if __name__ == "__main__":
    main()
    web.app.run()

