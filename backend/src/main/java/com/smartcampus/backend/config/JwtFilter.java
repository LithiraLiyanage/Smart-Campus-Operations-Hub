package com.smartcampus.backend.config;

import com.smartcampus.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Login & register skip
        if (path.contains("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        // 👉 check token exists
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 👉 extract token
        String token = authHeader.substring(7);

        try {
            if (!jwtUtil.validateToken(token)) {
                filterChain.doFilter(request, response);
                return;
            }

            String username = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);

            // Role-based restrictions rely on authorities, so we populate ROLE_ADMIN / ROLE_USER.
            List<SimpleGrantedAuthority> authorities =
                    (role == null || role.isBlank())
                            ? List.of()
                            : List.of(new SimpleGrantedAuthority("ROLE_" + role.trim().toUpperCase()));

            // 👉 set authentication
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            authorities
                    );

            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (Exception e) {
            // Invalid JWT -> let SecurityFilterChain handle authorization failure
        }

        filterChain.doFilter(request, response);
    }
}