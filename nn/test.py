import sys

input = sys.argv[1]

load_file = open("./nn/load_values.txt","a")
temp_file = open("./nn/temp_values.txt","a")
hum_file = open("./nn/hum_values.txt","a")

load_file.write(input+"\n")
temp_file.write(input[2]+"\n")
hum_file.write(input[4]+"\n")

load_file.close()
temp_file.close()
hum_file.close()


print("Final Result")
