module Api
	class BiometricsController < ApplicationController
		before_filter :authenticate_user!

		def index
			bw_data = current_user.weight_readings.select("id, weight, entry_date").order("entry_date DESC")
			bf_data = current_user.fat_readings.select("id, percent, entry_date").order("entry_date DESC")
			user_data = { bw: bw_data, bf: bf_data }
			render json: bw_data.as_json
		end

		def create
			biometric = params[:biometric]
			entrydate = biometric[:entry_date]
			is_valid_date = DateTime.strptime(entrydate, "%Y-%m-%d") # should throw ArgumentException if the string cannot be parsed
		
			bodyweight = {weight: biometric[:weight], entry_date: entrydate}
			bodyfat = {percent: biometric[:percent], entry_date: entrydate}

			# Move this stuff into a helper?
			if bodyweight[:weight] > 0
				weight_reading = current_user.weight_readings.build(bodyweight)
				weight_reading.save
			end
			if bodyfat[:percent] > 0
				bf_reading = current_user.fat_readings.build(bodyfat)
				bf_reading.save
			end

			render json: {message: 'success'}

		rescue ArgumentError
			render json: {message: 'invalid_entry_date'} # return an error code too?
		end
	end
end