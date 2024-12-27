import sys
from pymongo import MongoClient
import psutil
import socket
import uuid
import requests
from datetime import datetime

# Se obtiene las valores enviados y se almacena en variables
user_id = sys.argv[1]  
status = sys.argv[2] 

# Conectar a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['management']
collection = db['logs_login']

# Función para obtener la IP local correcta (no la de loopback)
def obtener_ip_local():
    for iface_name, iface_addrs in psutil.net_if_addrs().items():
        for addr in iface_addrs:
            if addr.family == socket.AF_INET and addr.address != '127.0.0.1':
                return addr.address
    return '127.0.0.1'

# Obtener la IP pública (con manejo de errores si no hay conexión a Internet)
def obtener_ip_publica():
    try:
        response = requests.get('https://api.ipify.org', timeout=5).text
        return response
    except requests.RequestException:
        return 'Sin conexión a Internet'

# Obtener la dirección MAC
def obtener_mac_address():
    mac_address = ':'.join(['{:02x}'.format((uuid.getnode() >> elements) & 0xff)
                            for elements in range(0, 2*6, 2)][::-1])
    return mac_address

# Obtener la fecha y hora actual
fecha_actual = datetime.now()

# Llamadas a las funciones para obtener la IP local, pública y dirección MAC
ip_local = obtener_ip_local()
ip_publica = obtener_ip_publica()
mac_address = obtener_mac_address()

# Estructura de los datos a guardar
login_data = {
    "user": user_id,
    "ip_local": ip_local,
    "ip_publica": ip_publica,
    "mac_address": mac_address,
    "estado": status,
    "fecha_login": fecha_actual
}

# Insertar el registro en MongoDB
collection.insert_one(login_data)

#print(f"Datos de login registrados correctamente para el usuario {user_id}")
