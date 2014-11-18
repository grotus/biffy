module Api
	class HelloworldController < ApplicationController
		before_filter :authenticate_user!

		def index
			render json: {message: 'Hello world'}
		end
	end
end

