module Api
	class BiometricsController < ApplicationController
		before_filter :authenticate_user!

		def index
			bw_data = current_user.weight_readings.select("id, weight, entry_date").order("entry_date DESC")
			render json: bw_data.as_json
		end

		def create
			biometric = params[:biometric]
			bodyweight = {weight: biometric[:weight], entry_date: biometric[:entry_date]}
			bodyfat = {percent: biometric[:percent], entry_date: biometric[:entry_date]}

			if bodyweight[:weight] > 0
				weight_reading = current_user.weight_readings.build(bodyweight)
				weight_reading.save
			end
			if bodyfat[:percent] > 0
				bf_reading = current_user.fat_readings.build(bodyfat)
				bf_reading.save
			end

			render json: {message: 'success'}
		end
	end
end