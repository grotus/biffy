class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :weight_readings, :dependent => :destroy do 
  	def by_date
  		select("id, weight, entry_date").order("entry_date DESC").map { |x| {entry_date: x.entry_date, bw_id: x.id, weight: x.weight} }
  	end
  end
  has_many :fat_readings, :dependent => :destroy do 
  	def by_date
  		select("id, percent, entry_date").order("entry_date DESC").map { |x| {entry_date: x.entry_date, bf_id: x.id, percent: x.percent} }
  	end
  end

  # What I would like to get out of this...
  # [..., { bw: {entry_date, bw_id, weight}, bf: nil }, ...]
  def collated_readings
  	bw = weight_readings.by_date
  	bf = fat_readings.by_date
  	(bf+bw).group_by {|x| x[:entry_date] }.values.sort_by {|x| x.first[:entry_date] }.reverse
  end
end
