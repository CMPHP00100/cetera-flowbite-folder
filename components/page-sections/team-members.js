
"use client";

import React from 'react';

const TeamMembers = () => {
  // Sample team data - replace with your actual data
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      jobTitle: "Lead Developer",
      image: "https://images.unsplash.com/photo-1556575533-7190b053c299?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      jobTitle: "UI/UX Designer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      jobTitle: "Product Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "David Kim",
      jobTitle: "Backend Engineer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      jobTitle: "Marketing Director",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 6,
      name: "James Wilson",
      jobTitle: "DevOps Engineer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face"
    }
  ];

  return (
    <>
      {/* Bootstrap CSS CDN */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="container py-5">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="display-5 mb-3 text-5xl font-bold font-cetera-libre text-cetera-dark-blue underline decoration-cetera-mono-orange">Meet Our Team</h2>
            <p className="lead text-muted">
              The talented individuals who make our company great
            </p>
          </div>
        </div>

        <div className="row g-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="col-lg-4 col-md-6 col-sm-12 font-cetera-josefin">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-4 bg-cetera-dark-blue rounded-t-md">
                  <div className="mb-3 d-flex justify-content-center">
                    <img
                      src={member.image}
                      alt={`${member.name} profile`}
                      className="rounded-circle mb-3"
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                        border: '4px solid #f8f9fa'
                      }}
                    />
                  </div>
                  <h5 className="fw-bold mb-2 text-cetera-light-gray">{member.name}</h5>
                  <p className="card-text mb-0 text-cetera-light-gray">{member.jobTitle}</p>
                </div>
                
                {/* Optional: Add social links or contact info */}
                <div className="card-footer bg-transparent border-0 text-center pb-2">
                  <div className="d-flex justify-content-center gap-2">
                    <button className="text-cetera-dark-blue text-sm hover:text-cetera-mono-orange">
                      <i className="bi bi-linkedin text-cetera-mono-orange"></i> LinkedIn
                    </button>
                    <span className="text-cetera-mono-orange text-xl mt-[-2px]">|</span>
                    <button className="text-cetera-dark-blue text-sm hover:text-cetera-mono-orange">
                      <i className="bi bi-envelope"></i> Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        .btn {
          transition: all 0.2s ease-in-out;
        }
        
        .btn:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
};

export default TeamMembers;