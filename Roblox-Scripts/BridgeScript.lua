local HttpService = game:GetService("HttpService")

-- URL Railway yang sudah aktif
local URL = "https://robloxstudio-pg-production.up.railway.app/ai"

local function sendDataToAI(message)
	local data = {
		["message"] = message,
		["userId"] = 12345,
		["timestamp"] = os.date("!*t")
	}
	
	-- Ubah tabel Lua menjadi format JSON
	local jsonPayload = HttpService:JSONEncode(data)
	
	print("Mengirim data ke Railway...")
	
	-- Kirim request ke server
	local success, response = pcall(function()
		return HttpService:PostAsync(URL, jsonPayload, Enum.HttpContentType.ApplicationJson)
	end)
	
	if success then
		print("Berhasil terhubung ke Railway!")
		local responseData = HttpService:JSONDecode(response)
		-- Menampilkan respon dari server kita di Railway
		if responseData.success then
			print("Server Railway merespon: OK")
		end
	else
		warn("Gagal terhubung ke Railway: " .. tostring(response))
	end
end

-- Contoh pemanggilan fungsi
sendDataToAI("Halo dari Roblox Studio!")
