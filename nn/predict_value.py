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

input = sys.argv[1]
input_array = input.split(",")

load_array= [int(input_array[0]),int(input_array[1]),int(input_array[2]),int(input_array[3]),int(input_array[4])]

input_tensor_test = torch.tensor([load_array], dtype=torch.float32)
predicted_output = load_model(input_tensor_test).item()
print(int(predicted_output),int(input_array[5])+int(input_array[4])) #43
#print("HEEEERE")