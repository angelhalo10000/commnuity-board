class ActiveStorageFrameOptions
  def initialize(app)
    @app = app
  end

  def call(env)
    status, headers, body = @app.call(env)
    if env['PATH_INFO'].start_with?('/rails/active_storage/')
      headers.delete('X-Frame-Options')
    end
    [ status, headers, body ]
  end
end
