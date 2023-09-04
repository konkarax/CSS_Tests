import torch
import torch.nn as nn
import sys

class SimpleNet(nn.Module):
    def __init__(self,input_size,hidden_size,output_size):
        super(SimpleNet, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size)
        self.fc1 = nn.Linear(hidden_size,hidden_size)
        self.fc2 = nn.Linear(hidden_size, output_size)
        self.relu = nn.ReLU()

    def forward(self, x):
        x,_ = self.lstm(x)
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        return x

load_model = SimpleNet(input_size=5,hidden_size=32,output_size=1)
load_model.load_state_dict(torch.load(f="./nn/models/bin_load_nn.pth",map_location=torch.device('cpu')))

hum_model = SimpleNet(input_size=5,hidden_size=32,output_size=1)
hum_model.load_state_dict(torch.load(f="./nn/models/bin_hum_nn.pth",map_location=torch.device('cpu')))

temp_model = SimpleNet(input_size=5,hidden_size=32,output_size=1)
temp_model.load_state_dict(torch.load(f="./nn/models/bin_temp_nn.pth",map_location=torch.device('cpu')))

input = sys.argv[1]
input_array = input.split(",")

load_array= [int(input_array[0]),int(input_array[1]),int(input_array[2]),int(input_array[3]),int(input_array[4])]
hum_array= [int(input_array[6]),int(input_array[7]),int(input_array[8]),int(input_array[9]),int(input_array[10])]
temp_array= [int(input_array[12]),int(input_array[13]),int(input_array[14]),int(input_array[15]),int(input_array[16])]


load_tensor_test = torch.tensor([load_array], dtype=torch.float32)
predicted_load = load_model(load_tensor_test).item()

hum_tensor_test = torch.tensor([hum_array], dtype=torch.float32)
predicted_hum = load_model(hum_tensor_test).item()

temp_tensor_test = torch.tensor([temp_array], dtype=torch.float32)
predicted_temp = load_model(temp_tensor_test).item()


print(int(predicted_load),int(predicted_hum),int(predicted_temp))