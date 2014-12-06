module Api
	class BiometricsController < ApplicationController
		before_filter :authenticate_user!

		def index
			bio_data = current_user.collated_readings.try(:values).sort_by { |x| x[:entry_date] }.reverse!
			render json: bio_data.as_json
		end

		def create
			biometric = params[:biometric]
			entrydate = biometric[:entry_date]
			is_valid_date = DateTime.strptime(entrydate, "%Y-%m-%d") # should throw ArgumentException if the string cannot be parsed

			entry_bw = biometric[:weight]
			entry_bf_percent = biometric[:percent]

			# TODO: Move this stuff into a helper
			if entry_bw > 0
				existing_bw = current_user.weight_readings.on(entrydate).first
				if existing_bw.nil?
					new_weight_reading = current_user.weight_readings.build({weight: entry_bw, entry_date: entrydate})
					new_weight_reading.save
				else
					existing_bw.weight = entry_bw
					existing_bw.save
				end
			end

			if entry_bf_percent > 0
				existing_bf_percent = current_user.fat_readings.on(entrydate).first
				if existing_bf_percent.nil?
					new_bf_reading = current_user.fat_readings.build({percent: entry_bf_percent, entry_date: entrydate})
					new_bf_reading.save
				else
					existing_bf_percent.percent = entry_bf_percent
					existing_bf_percent.save
				end
			end

			render json: {message: 'success'}

		rescue ArgumentError
			puts "INVALID ENTRY DATE POSTED: #{entrydate}"
			render json: {message: 'invalid_entry_date'} # return an error code too?
		end
	end
end