import numpy as np
import pandas as pd
import datetime
from datetime import time
from message_parser import canData
from time import sleep
from os import path

rawData = pd.DataFrame({k:[v] for k,v in canData.items()})
rawDataOutputFile = 'data/raw.csv'

TRACK_LENGTH = 3.15  # miles
BATT_AMP_HOURS = 169.9 # amp hours
PEOPLE_IN_VEHICLE = 2
TARGET_SPEED = 30  # mph


# finding start time and end time 
if (datetime.date.today() == datetime.date(2025, 7, 2)):
    start_time = time(10, 0, 0)
    end_time = time(18, 0, 0)
else:
    start_time = time(9, 0, 0)
    end_time = time(17, 0, 0)

def calc( last_Entry_Laps,  whole_Col_Amps_In,  whole_Col_Speed, last_Entry_Amps_Hours, whole_Col_Amps_Pulled,  metered_Charged, best_MOV_Distance):
    distance = (last_Entry_Laps - TRACK_LENGTH)
    avg_Amps_in = np.mean(whole_Col_Amps_In)
    avg_Speed = np.mean(whole_Col_Speed)
    amps_Hours_Used = (BATT_AMP_HOURS- last_Entry_Amps_Hours)
    amps_Hours_Left = (BATT_AMP_HOURS - amps_Hours_Used)
    avg_Amps_Pulled = np.mean(whole_Col_Amps_Pulled)
    time_Since_start = readingData.read_df[time].iloc[-1] - start_time
    time_Till_end = end_time - readingData.read_df[time].iloc[-1]

    person_Mile_Distance = distance  * PEOPLE_IN_VEHICLE  # Total distance traveled by the vehicle
    external_Energy_Usage = (1)* BATT_AMP_HOURS  + meteredCharged # add in metered charged. have to be a input from the user
    completion_Factor = person_Mile_Distance / best_MOV_Distance  # Best distance traveled by the vehicle

    if (avg_Speed >= TARGET_SPEED):
        target_Speed_Derate = 1
    else:
        target_Speed_Derate = 0.6 ** ((TARGET_SPEED - avg_Speed) ** 0.4)  # Derate factor based on speed difference

    total_Score = (person_Mile_Distance / external_Energy_Usage) * completion_Factor * target_Speed_Derate
    
    calculated_data = {
        'distance': distance,
        'avg_Amps_in': avg_Amps_in,
        'avg_Speed': avg_Speed,
        'amps_Hours_Used': amps_Hours_Used,
        'amps_Hours_Left': amps_Hours_Left,
        'avg_Amps_Pulled': avg_Amps_Pulled,
        'time_Since_start': time_Since_start,
        'time_Till_end': time_Till_end,
        'person_Mile_Distance': person_Mile_Distance,
        'external_Energy_Usage': external_Energy_Usage,
        'completion_Factor': completion_Factor,
        'target_Speed_Derate': target_Speed_Derate,
        'total_Score': total_Score
    }
    
    return calculated_data;
    


    

def saveData():
    while True:
        global rawData
        df = pd.DataFrame({k:[v] for k,v in canData.items()})
        #if df.equals(rawData):
        #    continue
        rawData = pd.concat([rawData, df])
        df.to_csv(rawDataOutputFile, mode='a', header=(not path.exists(rawDataOutputFile)), index=False)
        sleep(0.5)

