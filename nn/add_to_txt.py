import sys

input = sys.argv[1]

load_file = open("./nn/load_values.txt","a")
temp_file = open("./nn/temp_values.txt","a")
hum_file = open("./nn/hum_values.txt","a")

input_array = input.split(",")

load_str = input_array[0]+","+input_array[1]+","+input_array[2]+","+input_array[3]+","+input_array[4]+","+str(int(input_array[5])+int(input_array[4]))+"\n"
temp_str = input_array[6]+","+input_array[7]+","+input_array[8]+","+input_array[9]+","+input_array[10]+","+str(int(input_array[11])+int(input_array[10]))+"\n"
hum_str = input_array[12]+","+input_array[13]+","+input_array[14]+","+input_array[15]+","+input_array[16]+","+str(int(input_array[17])+int(input_array[16]))+"\n"


load_file.write(load_str)
temp_file.write(temp_str)
hum_file.write(hum_str)

load_file.close()
temp_file.close()
hum_file.close()


print("Final Result")
