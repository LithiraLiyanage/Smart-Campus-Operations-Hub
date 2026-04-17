package com.smartcampus.backend.config;

import com.smartcampus.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

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

System.out.println("PATH: " + path);

// login & register skip
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
            String username = jwtUtil.extractUsername(token);

            // 👉 set authentication
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            Collections.emptyList()
                    );

            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (Exception e) {
            System.out.println("Invalid JWT");
        }

        filterChain.doFilter(request, response);
    }
}