-- LocalScript: Letakkan di dalam StarterGui
local Players = game:GetService("Players")
local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

-- 1. Membuat ScreenGui
local screenGui = Instance.new("ScreenGui")
screenGui.Name = "InventoryGui"
screenGui.ResetOnSpawn = false
screenGui.Parent = playerGui

-- 2. Membuat Tombol Inventory (ImageButton)
local inventoryButton = Instance.new("ImageButton")
inventoryButton.Name = "InventoryButton"
inventoryButton.Size = UDim2.new(0, 60, 0, 60)
inventoryButton.AnchorPoint = Vector2.new(1, 1)
inventoryButton.Position = UDim2.new(1, -20, 1, -20)
inventoryButton.BackgroundColor3 = Color3.fromRGB(20, 20, 20) -- Background Hitam Pekat
inventoryButton.AutoButtonColor = false
inventoryButton.Parent = screenGui

-- 3. Membuat Corner (Agar bulat/tumpul)
local uiCorner = Instance.new("UICorner")
uiCorner.CornerRadius = UDim.new(0, 15)
uiCorner.Parent = inventoryButton

-- 4. Menambahkan ImageLabel di TENGAH (Untuk icon dari file .avif Anda)
local iconImage = Instance.new("ImageLabel")
iconImage.Name = "Icon"
iconImage.Size = UDim2.new(0.7, 0, 0.7, 0) -- Ukuran 70% dari tombol agar ada margin hitam
iconImage.Position = UDim2.new(0.5, 0, 0.5, 0)
iconImage.AnchorPoint = Vector2.new(0.5, 0.5)
iconImage.BackgroundTransparency = 1
iconImage.Image = "rbxassetid://123456789" -- GANTI INI DENGAN ASSET ID ANDA
iconImage.ScaleType = Enum.ScaleType.Fit
iconImage.Parent = inventoryButton

-- 5. Efek Hover (Warna background berubah saat disentuh)
inventoryButton.MouseEnter:Connect(function()
	inventoryButton.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
end)

inventoryButton.MouseLeave:Connect(function()
	inventoryButton.BackgroundColor3 = Color3.fromRGB(20, 20, 20)
end)

-- 5. Fungsi saat diklik
inventoryButton.MouseButton1Click:Connect(function()
	print("Inventory diklik!")
	-- Tambahkan logika buka inventory di sini
end)
