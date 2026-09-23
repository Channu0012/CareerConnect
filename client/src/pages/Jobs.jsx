// Jobs Page: Search, filter, paginate, and explore active job vacancies
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import { Search, MapPin, Filter, RotateCcw, Briefcase } from 'lucide-react';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Filter state synced with searchParams
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [employmentType, setEmploymentType] = useState(searchParams.get('employmentType') || 'All');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || 'All');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (location) queryParams.append('location', location);
      if (employmentType && employmentType !== 'All') queryParams.append('employmentType', employmentType);
      if (experienceLevel && experienceLevel !== 'All') queryParams.append('experienceLevel', experienceLevel);
      queryParams.append('page', page);
      queryParams.append('limit', 9);

      const res = await API.get(`/jobs?${queryParams.toString()}`);
      setJobs(res.data.jobs || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, employmentType, experienceLevel]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 on new search
    fetchJobs();
  };

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setEmploymentType('All');
    setExperienceLevel('All');
    setPage(1);
    setSearchParams({});
    setTimeout(() => {
      fetchJobs();
    }, 50);
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem', minHeight: '80vh' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Find Your Next Opportunity</h1>
          <p style={{ color: 'var(--gray-600)' }}>
            Explore verified career openings across top technology and finance organizations.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleSearchSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="form-label">Keyword or Skill</label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} color="var(--gray-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Job title, React, Node.js..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} color="var(--gray-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Bangalore, Remote, Hyderabad..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Employment Type</label>
                <select
                  className="form-control"
                  value={employmentType}
                  onChange={(e) => {
                    setEmploymentType(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="All">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="form-label">Experience Level</label>
                <select
                  className="form-control"
                  value={experienceLevel}
                  onChange={(e) => {
                    setExperienceLevel(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="All">All Experience Levels</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                  <option value="Lead / Principal">Lead / Principal</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--gray-500)', fontWeight: 500 }}>
                Found <strong>{total}</strong> active vacancies
              </span>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={handleResetFilters} className="btn btn-secondary btn-sm">
                  <RotateCcw size={14} />
                  <span>Reset Filters</span>
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Filter size={14} />
                  <span>Apply Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Job Listings Grid */}
        {loading ? (
          <Loader message="Fetching job opportunities..." />
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={36} color="var(--gray-400)" style={{ marginBottom: '1rem' }} />
            <h3>No jobs match your criteria</h3>
            <p style={{ color: 'var(--gray-500)', margin: '0.5rem 0 1.25rem' }}>
              Try adjusting your search terms or resetting the filter options.
            </p>
            <button onClick={handleResetFilters} className="btn btn-outline btn-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
              }}
            >
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>

                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}

                <button
                  className="btn btn-outline btn-sm"
                  disabled={page === pages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
