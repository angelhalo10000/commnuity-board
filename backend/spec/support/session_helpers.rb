module SessionHelpers
  def sign_in_as_admin(password: "admin_pass")
    post api_admin_session_path, params: { password: password }, as: :json
  end

  def sign_in_as_viewer(password: "member_pass")
    post api_viewer_session_path, params: { password: password }, as: :json
  end

  def sign_in_as_leader(password: "leader_pass")
    post api_viewer_session_path, params: { password: password }, as: :json
  end
end

RSpec.configure do |config|
  config.include SessionHelpers, type: :request
end
