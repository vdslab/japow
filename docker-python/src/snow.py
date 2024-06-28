import pygrib
import json
import numpy as np

# GRIBファイルを開く（編集したいファイル名)
filename = '/grib2/anl_snwlev.2024043012'
grbs = pygrib.open(filename)


# 日本の緯度経度範囲（北緯20度から45度、東経122度から153度）
japan_lat_min = 20
japan_lat_max = 46
japan_lon_min = 120
japan_lon_max = 150

# JSONファイルを開く (データを入れるファイル名)
output_filename = '/data/snowlev-2024043012.json'
with open(output_filename, 'w') as json_file:
    # JSON配列の開始
    json_file.write('[\n')

    # 座標ごとのデータを収集するための辞書
    data_dict = {}
    
    

    # ファイル内の全てのメッセージをイテレートして詳細情報を取得
    for grb in grbs:
        lat, lon = grb.latlons()
        values = grb.values


        # 日本の範囲内のデータのみ処理
        for i in range(len(lat)):
            for j in range(len(lat[i])):
                if japan_lat_min <= lat[i, j] <= japan_lat_max and japan_lon_min <= lon[i, j] <= japan_lon_max:
                    data_value = values[i, j]
                    # 欠損値（--）の処理
                    if data_value != '--':
                        coord_key = (lat[i, j], lon[i, j])
                        if coord_key not in data_dict:
                            data_dict[coord_key] = {
                                "latitude": lat[i, j],
                                "longitude": lon[i, j],
                                "values": []
                            }
                        data_dict[coord_key]["values"].append({
                            "message_number": grb.messagenumber,
                            "short_name": grb.shortName,
                            "data_value": data_value
                        })

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

# ファイルを閉じる
grbs.close()

print("Data has been stored in", output_filename)
