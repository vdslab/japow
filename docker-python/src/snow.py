import pygrib
import pandas as pd
import json
import os


# 本州、四国、九州などの主要な部分
MAINLAND_LAT_MIN = 30  # 北緯30度から
MAINLAND_LAT_MAX = 41  # 北緯41度まで
MAINLAND_LON_MIN = 128  # 東経128度から
MAINLAND_LON_MAX = 143  # 東経142度まで

# 北海道
HOKKAIDO_LAT_MIN = 41  # 北緯41度から
HOKKAIDO_LAT_MAX = 46  # 北緯46度まで
HOKKAIDO_LON_MIN = 139  # 東経139度から
HOKKAIDO_LON_MAX = 147  # 東経145度まで

parameterName = [
    "snowLayers",
    "iceT",
    "snowMassDensity",
    "waterContent",
    "iceContent",
    "airT",
    "dewPointDiff",
    "specificHumidity",
    "relativeHumidity",
    "windU",
    "windV"
    ]

snowLevFiles = os.listdir('/grib2')
surfFiles = os.listdir('/grib2_surf')
filePairs = []
for snowLevFile in snowLevFiles:
    for surfFile in surfFiles:
        if snowLevFile.split('.')[-1] == surfFile.split('.')[-1]:
            print()
            filePairs.append(
                [snowLevFile, surfFile]
            )
for pair in filePairs:
    # GRIBファイルを開く
    #積雪データ
    snwlevFilename = '/grib2/' + pair[0]
    snowlevGrbs = pygrib.open(snwlevFilename)

    #地表面解析値データ
    surfFileName = '/grib2_surf/' + pair[1]
    surfGrbs = pygrib.open(surfFileName)


    # JSONファイルを開く
    output_fileName = 'anl_data-' + pair[0].split('.')[-1]
    with open('/data/' + output_fileName + '.json', 'w') as json_file:
        # JSON配列の開始
        json_file.write('[\n')

        # 座標ごとのデータを収集するための辞書
        data_dict = {}

        # 積雪データを追加
        # 最初のメッセージから緯度経度を取得
        lat, lon = snowlevGrbs.message(1).latlons()
        latLength = lat.shape[0]
        lonLength = lon.shape[1]
        paramIndex = 0
        for grb in snowlevGrbs:
            if grb.messagenumber == 2 or grb.messagenumber == 5 or grb.messagenumber == 9 or grb.messagenumber == 13 or grb.messagenumber == 17:
                values = grb.values
                for i in range(latLength):
                    for j in range(lonLength):
                        if MAINLAND_LAT_MIN <= lat[i][j] <= MAINLAND_LAT_MAX and MAINLAND_LON_MIN <= lon[i][j] <= MAINLAND_LON_MAX or HOKKAIDO_LAT_MIN <= lat[i][j] <= HOKKAIDO_LAT_MAX and HOKKAIDO_LON_MIN <= lon[i][j] <= HOKKAIDO_LON_MAX:
                            data_value = values[i, j]
                            if data_value != '--':
                                coord_key = (lat[i, j], lon[i, j])
                                if coord_key not in data_dict:
                                    data_dict[coord_key] = {
                                        "latitude": lat[i, j],
                                        "longitude": lon[i, j],
                                        "values": []
                                    }
                                data_dict[coord_key]["values"].append({
                                    "name": parameterName[paramIndex],
                                    "data_value": data_value
                                })
                paramIndex += 1

        # 地表面データを追加
        # 最初のメッセージから緯度経度を取得
        surfLat, surfLon = surfGrbs.message(1).latlons()
        surfLatLength = lat.shape[0]
        surfLonLength = lon.shape[1]
        for grb in surfGrbs:
            lat, lon = grb.latlons()
            values = grb.values
            if 8 <= grb.messagenumber:
                # 日本の範囲内のデータのみ処理
                for i in range(len(surfLat)):
                    for j in range(len(surfLat[i])):
                        if MAINLAND_LAT_MIN <= surfLat[i][j] <= MAINLAND_LAT_MAX and MAINLAND_LON_MIN <= surfLon[i][j] <= MAINLAND_LON_MAX or HOKKAIDO_LAT_MIN <= surfLat[i][j] <= HOKKAIDO_LAT_MAX and HOKKAIDO_LON_MIN <= surfLon[i][j] <= HOKKAIDO_LON_MAX:
                            data_value = values[i, j]
                            # 欠損値（--）の処理
                            if data_value != '--':
                                coord_key = (surfLat[i, j], surfLon[i, j])
                                if coord_key in data_dict:
                                    data_dict[coord_key]["values"].append({
                                        "name": parameterName[paramIndex],
                                        "data_value": data_value
                                    })
                paramIndex += 1

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
