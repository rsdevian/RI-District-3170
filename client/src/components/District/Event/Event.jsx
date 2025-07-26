import { useState } from "react";
import { getMembersByTier } from "../../../contents/events.district.js";
import "../../../styles/Event.css";
import CloseIcon from "@mui/icons-material/Close";

function Event() {
    const [selectedMember, setSelectedMember] = useState(null);

    const subMainMembers2 = getMembersByTier("sub-main2");

    // const handleMemberClick = (member) => {
    //     setSelectedMember(member);
    // };

    const closeModal = () => {
        setSelectedMember(null);
    };

    const MemberCard = ({ member, tier }) => (
        <div
            className={`member-card ${tier}`}
            // onClick={() => handleMemberClick(member)}
        >
            {/* <div className='member-image-container'>
                <img
                    src={member.image}
                    alt={member.name}
                    className='member-image'
                    onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            member.name
                        )}&background=667eea&color=fff&size=400`;
                    }}
                />
                <div className='member-overlay'>
                    <span>View Details</span>
                </div>
            </div> */}
            <div className='member-info'>
                <h3 className='member-name'>{member.name}</h3>
                <p className='member-position'>{member.position}</p>
                {/* <p className='member-bio'>{member.bio}</p> */}
            </div>
        </div>
    );

    return (
        <div className='council-container'>
            {/* Header Section */}
            {/* <div className='council-header'>
                <h1>Disctrict Council</h1>
                <p>
                    Meet the dedicated leaders who guide our organization
                    towards excellence
                </p>
            </div> */}

            {/* Sub Main - 2nd Row (2 people) */}
            <section className='council-section sub-main-section'>
                <h2 className='section-title'>District Events</h2>
                <div className='sub-main-member-row2'>
                    {subMainMembers2.map((member) => (
                        <MemberCard
                            key={member.id}
                            member={member}
                            tier='sub-main'
                        />
                    ))}
                </div>
            </section>

            {/* Member Detail Modal */}
            {selectedMember && (
                <div className='modal-overlay' onClick={closeModal}>
                    <div
                        className='modal-content'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className='modal-close' onClick={closeModal}>
                            <CloseIcon />
                        </button>
                        <div className='modal-header'>
                            <img
                                src={selectedMember.image}
                                alt={selectedMember.name}
                                className='modal-image'
                                onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        selectedMember.name
                                    )}&background=667eea&color=fff&size=400`;
                                }}
                            />
                            <div className='modal-info'>
                                <h2>{selectedMember.name}</h2>
                                <h3>{selectedMember.position}</h3>
                            </div>
                        </div>
                        <div className='modal-body'>
                            {/* <p className='modal-bio'>{selectedMember.bio}</p> */}
                            <div className='modal-contact'>
                                <div className='contact-item'>
                                    <span className='contact-label'>
                                        Email:
                                    </span>
                                    <a
                                        href={`mailto:${selectedMember.email}`}
                                        className='contact-value'
                                    >
                                        {selectedMember.email}
                                    </a>
                                </div>
                                <div className='contact-item'>
                                    <span className='contact-label'>
                                        Phone:
                                    </span>
                                    <a
                                        href={`tel:${selectedMember.phone}`}
                                        className='contact-value'
                                    >
                                        {selectedMember.phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Event;
