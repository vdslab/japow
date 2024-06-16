import pygrib
import pandas as pd
import json

# GRIBファイルを開く
filename = '/grib2/anl_snwlev.2023020212'
grbs = pygrib.open(filename)

# 本州、四国、九州などの主要な部分
MAINLAND_LAT_MIN = 30  # 北緯30度から
MAINLAND_LAT_MAX = 41  # 北緯41度まで
MAINLAND_LON_MIN = 128  # 東経128度から
MAINLAND_LON_MAX = 142  # 東経142度まで

# 北海道
HOKKAIDO_LAT_MIN = 41  # 北緯41度から
HOKKAIDO_LAT_MAX = 46  # 北緯46度まで
HOKKAIDO_LON_MIN = 139  # 東経139度から
HOKKAIDO_LON_MAX = 145  # 東経145度まで

parameterName = ["snowag", "snowlayers", "snowAlbedoAgainstVisible", "snowAlbedoForNear-infrared", "t1", "t2", "t3", "t4", "snowMassDensity1", "snowMassDensity2", "snowMassDensity3", "snowMassDensity4", "WaterContent1", "WaterContent2", "WaterContent3", "WaterContent4", "iceContent1", "iceContent2", "iceContent3", "iceContent4"]


# JSONファイルを開く
output_filename = '/src/index.json'
with open(output_filename, 'w') as json_file:
    # JSON配列の開始
    json_file.write('[\n')

    # 座標ごとのデータを収集するための辞書
    data_dict = {}

    # 最初のメッセージから緯度経度を取得
    lat, lon = grbs.message(1).latlons()
    latLength = lat.shape[0]
    lonLength = lon.shape[1]
    for grb in grbs:
        values = grb.values
        for i in range(latLength):
            for j in range(lonLength):
                if MAINLAND_LAT_MIN <= lat[i][j] <= MAINLAND_LAT_MAX and MAINLAND_LON_MIN <= lon[i][j] <= MAINLAND_LON_MAX or HOKKAIDO_LAT_MIN <= lat[i][j] <= HOKKAIDO_LAT_MAX and HOKKAIDO_LON_MIN <= lon[i][j] <= HOKKAIDO_LON_MAX:
                    value = values[i][j]
                    if value != '__':
                        coord_key = (lat[i][j], lon[i][j])
                        if coord_key not in data_dict:
                            data_dict[coord_key] = {
                                "latitude": lat[i][j],
                                "longitude": lon[i][j],
                                "values": {}
                            }
                        data_dict[coord_key]["values"][parameterName[grb.messagenumber - 1]] = value
                
    # 辞書からJSONファイルに書き込み
    first_entry = True
    for coord, data in data_dict.items():
        if first_entry:
            first_entry = False
        else:
            json_file.write(',\n')
        json.dump(data, json_file, ensure_ascii=False, indent=4)

    # JSON配列の終了
    json_file.write('\n]')


print("Data has been stored in", output_filename)
