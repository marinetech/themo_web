from pymongo import MongoClient
from bson import Binary, Code
from bson.objectid import ObjectId
from bson.json_util import loads
import json

def init_db():
    global client; client = MongoClient()
    global db; db = client.themo


# if the the buoy was already added, we will remove all references to it (samples, sensors and the buoy itself)
def clean():
    # get all related sensors; for each sensor remove it's samples and then remove the sensor itself
    buoy_filter = {}
    buoy_filter["name"] = buoy_name
    sensor_filter = {}
    sensor_filter["buoy_name"] = buoy_name
    sensors = db.sensors.find(sensor_filter)
    for sensor in sensors:
        sample_filter = {}
        sample_filter["sensor_id"] = str(sensor["_id"])
        db.samples.remove(sample_filter)
    db.sensors.remove(sensor_filter)
    db.buoys.remove(buoy_filter)


def add_schema_for_new_buoy():

    buoy_doc = {}
    buoy_doc["name"] = buoy_name
    buoy_doc["depth"] = 1400
    db.buoys.insert_one(buoy_doc)

    for sensor in [
        { "name": 'dcs', "description": 'Near Surface Doppler Current Sensor', "manufacturer": 'Aanderaa', "model": 'DCS-4100R', "buoy_name": buoy_name },
        { "name": 'adcp', "description": 'Acoustic Doppler Current Profiler', "manufacturer": 'Nortek', "model": 'signature 250', "buoy_name": buoy_name },
        { "name": 'flntu', "description": 'Fluorometer', "manufacturer": 'WetLabs', "model": 'flntu',  "buoy_name": buoy_name, "chl_dark_count": 47, "chl_sf": 0.0119, "ntu_dark_count": 50, "ntu_sf": 0.0061},
        { "name": 'microcat', "description": 'Conductivity and temperature sensor', "manufacturer": 'Seabird Electronics', "model": 'SBE37-SI', "buoy_name": buoy_name },
        { "name": 's9', "description": ' ULTI Modem Underwater Inductive Modem', "manufacturer": 'Sound Nine', "model": 'ULTI Modem',  "buoy_name": buoy_name },
        { "name": 'metpak', "description": 'All in one MET sensor', "manufacturer": 'Gill', "model": 'MetPak',  "buoy_name": buoy_name },
        { "name": 'windsonic', "description": 'Anemometer', "manufacturer": 'Gill', "model": 'Windsonic',  "buoy_name": buoy_name },
        { "name": 'spp', "description": 'Standard Precision Pyranometer (shortwave Iradiance)', "manufacturer": 'Eppley Laboratories', "model": 'SPP',  "buoy_name": buoy_name } ,
        { "name": 'pir',"description": 'Precision Infrared Radiometer (longwave Iradiance)',"manufacturer": 'Eppley Laboratories', "model": 'PIR',  "buoy_name": buoy_name } ,
        { "name": 'mp101a_humidity', "description": 'External Humidity Sensor', "manufacturer": 'TRDI', "model": 'MP101A',  "buoy_name": buoy_name } ,
        { "name": 'mp101a_temprature', "description": 'External Temprature Sensor', "manufacturer": 'TRDI', "model": 'MP101A', "buoy_name": buoy_name } ,
        { "name": 'barometer', "description": 'Barometric Pressure', "manufacturer": 'Vaisala', "model": 'PTB210',   "buoy_name": buoy_name } ,
        { "name": 'waves', "description": 'Waves', "manufacturer": 'MicroStrain', "model": '3DM-GX25',   "buoy_name": buoy_name },
        { "name": 'battery', "description": 'battery level', "manufacturer": 'GERG', "model": '',   "buoy_name": buoy_name }
    ]:
        db.sensors.insert_one(sensor)






def init_buoy(buoy_name):
    filter = {}
    filter["name"] = buoy_name
    global buoy_id; buoy_id = db.buoys.find_one(filter)["_id"]

    dict_sensors.clear()
    filter = {}
    filter["buoy_name"] = buoy_name
    for sensor in db.sensors.find(filter):
        dict_sensors[sensor["name"]] = sensor["_id"]


def insert_samples(document):
    db.samples.insert_one(loads(document))


def get_s9_sensors():
    filter = {'name':'s9'}
    s9 = db.sensors.find(filter)
    return s9[0]["child_sensors"]


# return caliibration-related constants for FLNTU
def get_callibration_values(sensor_id):
    filter = {"_id": ObjectId(sensor_id)}
    flntu = db.sensors.find(filter)

    # no error checking, we'll have to add some
    ret = {}
    ret["chl_dark_count"] = flntu[0]["chl_dark_count"]
    ret["chl_sf"] = flntu[0]["chl_sf"]
    ret["ntu_dark_count"] = flntu[0]["ntu_dark_count"]
    ret["ntu_sf"] = flntu[0]["ntu_sf"]

    return ret


# main-content
buoy_name = "tabs225m11"
print("Attempting to add bouy: " + buoy_name)

init_db()
clean()
add_schema_for_new_buoy()
